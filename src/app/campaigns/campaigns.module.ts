import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignsPage } from './campaigns.page';
import { CampaignPage } from './campaign/campaign.page';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CampaignCreateComponent } from './campaign-create/campaign-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [CampaignsPage, CampaignPage, CampaignCreateComponent],
  exports: [CampaignPage, CampaignPage, CampaignCreateComponent]
})
export class CampaignsPageModule {}
