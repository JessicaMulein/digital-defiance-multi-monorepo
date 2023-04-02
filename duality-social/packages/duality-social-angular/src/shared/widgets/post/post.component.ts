import { Component, Input } from "@angular/core";
import { IPost } from "@digital-defiance/duality-social-lib";

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
  })
export class PostComponent {
  @Input() public post!: IPost;
  constructor() { 
    //
  }
}