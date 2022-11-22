import { receiveMessages, sendMessageFromBackground } from "./chromeMessaging";
import { IChromeMessage } from "./interfaces";
import MessageContext from "./messageContext";
import MessageType from "./messageType";
import * as chrome from "sinon-chrome";
import * as sinon from "sinon";

describe('chromeMessaging', () => {
    it("should call chrome.runtime.sendMessage", () => {
        // arrange
        const message: IChromeMessage = { type: MessageType.GlobalSettingsUpdate, context: MessageContext.Extension, data: null};
        // act
        sendMessageFromBackground(message);
        // assert
        sinon.assert.calledOnce(chrome.runtime.sendMessage);
        sinon.assert.calledWith(chrome.runtime.sendMessage, message);
    });
    it("should receive a message using receiveMessages", () => {
        // arrange
        const message: IChromeMessage = { type: MessageType.GlobalSettingsUpdate, context: MessageContext.Extension, data: null};
        const callback = sinon.spy();
        // act
        receiveMessages(callback);
        chrome.runtime.onMessage.trigger(message);
        // assert
        sinon.assert.calledOnce(callback);
        sinon.assert.calledWith(callback, message);
    });
    it("should not call callback when message is not an object", () => {
        // arrange
        const message = "test";
        const callback = sinon.spy();
        // act
        receiveMessages(callback);
        chrome.runtime.onMessage.trigger(message);
        // assert
        sinon.assert.notCalled(callback);
    });
    it("should not call callback when message is an object but does not have a type property", () => {
        // arrange
        const message = { test: "test" };
        const callback = sinon.spy();
        // act
        receiveMessages(callback);
        chrome.runtime.onMessage.trigger(message);
        // assert
        sinon.assert.notCalled(callback);
    });
});