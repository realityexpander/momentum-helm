import { Injectable } from '@angular/core';

export class Profile {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public title: string,
    public experience: string[],
    public connections: number[]
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profiles: Profile[] = [];

  get defaultProfiles() {
    return [
      new Profile(
        1,
        'Harry',
        'Stephens',
        'Mr.',
        ['Product Designer 2020', 'Developer 2021'],
        []
      ),
      new Profile(
        2,
        'David',
        'Rasch',
        'Mr.',
        ['Developer 2020', 'Angular Instructor 2021'],
        []
      ),
      new Profile(
        3,
        'Alan',
        'Cox',
        'Mr.',
        ['CFO 2017-2018', 'CEO 2018-2019', 'CTO 2020-2021'],
        []
      ),
      new Profile(
        4,
        'Dee',
        'Meyers',
        'Ms.',
        ['Student 2019', 'Student 2020', 'Developer 2021'],
        []
      ),
    ];
  }

  constructor() {
    this.load();
  }

  decodeProfile(json: Profile): Profile {
    let profile = Object.create(Profile.prototype);
    return Object.assign(profile, json);
  }

  getProfiles() {
    return this.profiles;
  }

  addProfile(profile: Profile) {
    this.profiles.push(profile);
  }

  getProfile(index: number) {
    return this.profiles.find((profile) => profile.id == index);
  }

  save() {
    localStorage.setItem('profiles', JSON.stringify(this.profiles));
  }

  load() {
    this.profiles = JSON.parse(localStorage.getItem('profiles') || '[]').map(
      (obj: Profile) => this.decodeProfile(obj)
    );

    if (this.profiles.length == 0) {
      this.profiles = this.defaultProfiles;
    }
  }

  clear() {
    localStorage.clear();
  }

  addExperience(index: number, experience: string) {
    const profile = this.getProfile(index);
    if (profile) {
      return profile.experience.push(experience);
    } else {
      throw 'Profile does not exist';
    }
  }

  connect(first: number, second: number) {
    const firstProfile = this.getProfile(first);
    const secondProfile = this.getProfile(second);
    if (!firstProfile || !secondProfile) {
      throw 'Tried connecting to non-existant profile(s)';
    }

    if (!firstProfile.connections.find((num) => num == second)) {
      firstProfile.connections.push(second);
    }
    if (!secondProfile.connections.find((num) => num == first)) {
      secondProfile.connections.push(first);
    }
  }

  disconnect(first: number, second: number) {
    const firstProfile = this.getProfile(first);
    const secondProfile = this.getProfile(second);

    if (!firstProfile || !secondProfile) {
      throw 'Tried disconnecting non-existant profile(s)';
    }

    let found = firstProfile.connections.findIndex((num) => num == second);
    if (found >= 0) {
      firstProfile.connections.splice(found, 1);
    }

    found = secondProfile.connections.findIndex((num) => num == first);
    if (found >= 0) {
      secondProfile.connections.splice(found, 1);
    }
  }

  isConnected(first: number, second: number) {
    const firstProfile = this.getProfile(first);
    const secondProfile = this.getProfile(second);

    if (!firstProfile || !secondProfile) {
      throw 'Tried checking connections for non-existant profile(s)';
    }

    return firstProfile.connections.find((num) => num == second);
  }
}
