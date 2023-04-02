import {
    BaseModelCaches,
    HumanityTypeEnum,
} from '@digital-defiance/duality-social-lib';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';

const maxPostLength = 1000;

export async function newPost(req: Request, res: Response) {
    const content = req.body.content;
    const currentDate = new Date();
    const createdById = new Schema.Types.ObjectId(BaseModelCaches.Users.Path);

    // validate the request
    if (content.length > maxPostLength) {
        res.status(400).send('Post content is too long');
        return;
    }
    if (content.trim().length === 0) {
        res.status(400).send('Post content is empty');
        return;
    }

    // TODO: use session/transaction
    // create a new post
    const post = new BaseModelCaches.Posts.Model({
        inReplyToViewpointId: undefined,
        inputViewpointId: undefined,
        aiViewpointId: undefined,
        parentId: undefined,
        parents: [],
        viewpointParents: [],
        meta: {
            expands: 0,
            impressions: 0,
            reactions: 0,
            reactionsByType: {},
            updatedAt: currentDate,
        },
        createdAt: currentDate,
        createdById: createdById,
        updatedAt: currentDate,
        updatedById: createdById,
    });
    // save the post
    const newPostId = (await BaseModelCaches.Posts.Model.create(post))._id;
    if (newPostId === undefined) {
        throw new Error('post._id is undefined');
    }
    post._id = newPostId;
    // create the input viewpoint
    const inputViewpoint = new BaseModelCaches.PostViewpoints.Model({
        postId: newPostId,
        content: content,
        language: 'en',
        humanityType: HumanityTypeEnum.Human,
        parentViewpointId: undefined,
        meta: {
            expands: 0,
            impressions: 0,
            reactions: 0,
            reactionsByType: {},
        },
        createdAt: currentDate,
        createdById: createdById,
        updatedAt: currentDate,
        updatedById: createdById,
    });
    // save the input viewpoint
    const inputViewpointId = (await BaseModelCaches.PostViewpoints.Model.create(inputViewpoint))._id;
    if (inputViewpointId === undefined) {
        throw new Error('inputViewpoint._id is undefined');
    }
    inputViewpoint._id = inputViewpointId;
    // update the post with the input viewpoint id
    post.inputViewpoint = inputViewpointId;
    const updateStatus = await BaseModelCaches.Posts.Model.updateOne(
        { _id: newPostId }, {
            $set: {
                inputViewpoint: inputViewpointId,
            },
        }
    );
    if (updateStatus.modifiedCount !== 1) {
        throw new Error('Post input viewpoint id not updated');
    }
    res.status(200).send(post);
}
