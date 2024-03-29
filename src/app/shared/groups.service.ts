import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, switchAll, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private groupsCollection: AngularFirestoreCollection<any>;
  private groupUsersCollection: AngularFirestoreCollection<any>;
  private userGroupsCollection: AngularFirestoreCollection<any>;

  private userGroupsIds: Array<any> = [];
  public userGroups: Observable<any>;

  // Users in the group
  public groupUsersCache: any = {};
  public groupUsers: Observable<any>;

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
        map(g => g.map(v => Object.values(v)[0])), // Map collection of ids (object) into array of ids
        switchMap(v => {  // Map into a new observable
          console.log('i');
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

    const groupUser: any = {};
    // groupUser[this.auth.userData.uid] = true;
    groupUser.id = this.auth.userData.uid;
    this.groupUsersCollection.doc(id + '/users/' + this.auth.userData.uid).set(groupUser);

    const userGroup: any = {};
    userGroup.id = id;
    this.userGroupsCollection.doc(this.auth.userData.uid + '/groups/' + id).set(userGroup);

    const emailId = this.afs.createId();
    this.afs.collection('emails').doc(emailId).set({
      to: this.auth.userData.email, vars: {
        group_url: environment.baseUrl + 'dashboard/groups/' + emailId,
        group_name: data.name,
      }
    });
  }

  update() {

  }

  getUsers(groupId): Observable<any> {
    let groupUsers$ = null;
    if (!this.groupUsersCache[groupId]) {
      groupUsers$ = this.afs.collection('group_users/' + groupId + '/users').valueChanges();
      groupUsers$ = groupUsers$.pipe(
        map((g: any) => g.map(v => Object.values(v)[0])), // Map collection of ids (object) into array of ids
        switchMap((v: Array<any>) => {  // Map into a new observable
          const groupUsersIds = v.length ? v : ['*'];
          return this.afs.collection('users', ref => ref.where('id', 'in', groupUsersIds)).valueChanges();
        })
      );
    } else {
      groupUsers$ = this.groupUsersCache[groupId];
    }

    return groupUsers$;
  }

  addUser(groupId, userId): Promise<any> {
    const groupUser = {};
    groupUser[userId] = true;
    return this.groupUsersCollection.doc(groupId).collection('users').add(groupUser);
  }
}
