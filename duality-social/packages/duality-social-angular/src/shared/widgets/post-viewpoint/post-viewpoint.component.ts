import { Component, Input, ViewEncapsulation } from "@angular/core";
import { IPostViewpoint } from "@digital-defiance/duality-social-lib";

@Component({
    selector: 'app-post-viewpoint',
    templateUrl: './post-viewpoint.component.html',
    styleUrls: ['./post-viewpoint.component.css'],
    encapsulation: ViewEncapsulation.None,
  })
export class PostViewpointComponent {
  @Input() public viewpoint!: IPostViewpoint;
  constructor() {
    //
  }
}