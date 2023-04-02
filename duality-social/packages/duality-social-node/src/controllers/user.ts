import {
    AccountLoginTypeEnum,
    AccountStatusTypeEnum,
    AdminLevelEnum,
    BaseModelCaches,
    HumanityTypeEnum,
    LockTypeEnum,
} from '@digital-defiance/duality-social-lib';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { environment } from '../environments/environment';

function validateMsalToken(token: string, audience: string, issuer: string, publicKey: string): boolean {
  try {
    // Verify the token with the public key
    const decoded = jwt.verify(token, publicKey, {
      audience,
      issuer,
      algorithms: ['RS256'],
    });
    console.log('MSAL token decoded:', decoded);
    // The token is valid
    return true;

  } catch (err) {
    // The token is not valid
    console.error('Failed to validate MSAL token:', err);
    return false;
  }
}

async function getMsalPublicKey(): Promise<string> {
  const url = `https://login.microsoftonline.com/${environment.msal.tenantId}/.well-known/openid-configuration`;

  try {
    const response = await axios.get(url);
    const jwksUri = response.data.jwks_uri;
    const jwksResponse = await axios.get(jwksUri);
    const publicKey = jwksResponse.data.keys[0].x5c[0];
    return publicKey;

  } catch (err) {
    console.error('Failed to retrieve MSAL public key:', err);
    throw err;
  }
}

// POST with no body, but must have Authorization header with Bearer token
export async function login(req: Request, res: Response): Promise<void> {
    // capture the event date
    const currentDate = new Date();
    // we should actually have the user data already in session
    if (!req.session || !req.session.account) {
        //res.status(401).send('Session not found');
        //return;
        console.log('Session not found');
    }
    console.log(req.session.account);

    // verify if the header has the authorization token
    const authHeader = req.headers.authorization;
    if (authHeader === undefined) {
        res.status(401).send('Authorization header is missing');
        return;
    }
    // verify if the authorization token is valid MSAL authentication token
    const authHeaderParts = authHeader.split(' ');
    if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
        res.status(401).send('Authorization header is invalid');
        return;
    }
    // verify if the token is valid
    const token = authHeaderParts[1];

    const msalPublicKey = await getMsalPublicKey();
    // get the issuer from the decoded token
    const decoded = jwt.decode(token);
    if (decoded === null || typeof decoded === 'string') {
        res.status(401).send('Authorization token is invalid');
        return;
    }
    const issuer = decoded.iss ?? '';
    const isValid = validateMsalToken(token, environment.msal.clientId, issuer, msalPublicKey);
    if (!isValid) {
        res.status(401).send('Authorization token is invalid');
        return;
    }
    // get the user information from the token
    // create a new user
    const newUser = new BaseModelCaches.Users.Model({
        accountStatusType: AccountStatusTypeEnum.Active,
        accountType: AccountLoginTypeEnum.Microsoft,
        accountEmail: decoded.email,
        emailVerified: decoded.emailVerified,
        userName: decoded.preferred_username,
        adminLevel: AdminLevelEnum.User,
        adminFreezeType: decoded.emailVerified ? LockTypeEnum.Unlocked : LockTypeEnum.PendingEmailVerification,
        shadowBan: false,
        userHidden: false,
        meta: {
            totalPosts: 0,
            totalComments: 0,
            totalVotes: 0,
            totalVotesReceived: 0,
            totalProfileViewsReceived: 0,
            totalPostViewsReceived: 0,
            totalReplyViewsReceived: 0,
        },
        createdAt: currentDate,
        updatedAt: currentDate,
        updatedBy: new Schema.Types.ObjectId('/users'), // placeholder
    });
    // save the user
    await newUser.save();
    // update the updatedBy field now that we have an ID
    newUser.updatedBy = newUser._id;
    await newUser.save();

    res.status(200).json(newUser);
}
