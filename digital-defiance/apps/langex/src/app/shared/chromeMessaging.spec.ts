import { receiveMessages, sendMessage } from "./chromeMessaging";
import { IChromeMessage } from "./interfaces";
import MessageContext from "./messageContext";
import MessageType from "./messageType";
import * as chrome from "sinon-chrome";
import * as sinon from "sinon";

describe('chromeMessaging', () => {
    it("should call chrome.runtime.sendMessage", () => {
        // arrange
        const message: IChromeMessage = { type: MessageType.SettingsUpdate, context: MessageContext.Extension, data: null};
        // act
        sendMessage(message);
        // assert
        sinon.assert.calledOnce(chrome.runtime.sendMessage);
        sinon.assert.calledWith(chrome.runtime.sendMessage, message);
    });
    it("should receive a message using receiveMessages", () => {
        // arrange
        const message: IChromeMessage = { type: MessageType.SettingsUpdate, context: MessageContext.Extension, data: null};
        const callback = sinon.spy();
        // act
        receiveMessages(callback);
        chrome.runtime.onMessage.trigger(message);
        // assert
        sinon.assert.calledOnce(callback);
        sinon.assert.calledWith(callback, message);
    });
});