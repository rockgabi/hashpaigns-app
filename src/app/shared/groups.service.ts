import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchAll, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private groupsCollection: AngularFirestoreCollection<any>;
  private groupUsersCollection: AngularFirestoreCollection<any>;
  private userGroupsCollection: AngularFirestoreCollection<any>;

  private userGroupsIds: Array<any> = [];
  public userGroups: Observable<any>;

  constructor(
    public afs: AngularFirestore,
    public router: Router,
    public auth: AuthService,
  ) {
    this.groupsCollection = this.afs.collection('groups');
    this.groupUsersCollection = this.afs.collection('group_users');
    this.userGroupsCollection = this.afs.collection('user_groups');

    // Get groups that have a reference under the user_groups collection for the current user
    const ugc = this.afs.collection('user_groups/' + auth.userData.uid + '/groups');
    this.userGroups = ugc.valueChanges()
      .pipe(
        map(g => g.map(v => Object.keys(v)[0])), // Map collection of ids (object) into array of ids
        switchMap(v => {  // Map into a new observable
          this.userGroupsIds = v.length ? v : ['*'];
          return this.afs.collection('groups', ref => ref.where('id', 'in', this.userGroupsIds)).valueChanges();
        })
      );
  }

  getAll(): Observable<any> {
    return this.userGroups;
  }

  create(data) {
    // Persist a document id
    const id = this.afs.createId();
    const item: any = { id, ...data };
    this.groupsCollection.doc(id).set(item);

    const groupUser = {};
    groupUser[this.auth.userData.uid] = true;
    this.groupUsersCollection.doc(id).collection('users').add(groupUser);

    const userGroup = {};
    userGroup[id] = true;
    this.userGroupsCollection.doc(this.auth.userData.uid).collection('groups').add(userGroup);
  }

  update() {

  }
}