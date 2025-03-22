import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TrackViewDirective, TrackProductDirective, TrackEventDirective } from "./directives/track-view.directive";
import { DLManagerService } from "./dl-manager.service";

@NgModule({
	declarations: [TrackViewDirective, TrackProductDirective, TrackEventDirective],
	imports: [CommonModule],
	exports: [TrackViewDirective, TrackProductDirective, TrackEventDirective],
	providers: [DLManagerService],
})
export class DLManagerModule {}
