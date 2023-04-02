import { environment } from "./environments/environment";
import { BaseModelCaches, IPost } from "@digital-defiance/duality-social-lib";
console.log("environment: ", environment.production ? "production" : "development");
// select all documents from posts where aiViewpointId is null
console.log("selecting all documents from posts where aiViewpointId is null");
const query = BaseModelCaches.Posts.Model.find({ aiViewpoint: { $exists: false } });

query.exec().then((posts: Array<IPost>) => {
    console.log("posts: ", posts);
    posts.forEach((post: IPost) => {
        console.log("post: ", post);
    });
});