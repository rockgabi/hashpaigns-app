import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { AngularFireModule } from '@angular/fire';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    AngularFireModule
  ],
  declarations: [CampaignCardComponent],
  exports: [CampaignCardComponent],
  providers: []
})
export class SharedModule {}
