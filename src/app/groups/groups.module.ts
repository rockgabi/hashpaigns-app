import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsPage } from './groups.page';
import { RouterModule } from '@angular/router';
import { GroupPage } from './group/group.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [GroupsPage, GroupPage]
})
export class GroupsPageModule {}