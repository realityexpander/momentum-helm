import {
  ElementRef,
  Component,
  ContentChild,
  Input,
  OnInit,
  AfterContentInit,
} from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ProfilesService } from '../profiles.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit, AfterContentInit {
  @Input() profile!: number;

  @ContentChild('morestuff') morestuff!: ElementRef;

  newExperience: string = '';
  repositories: Repository[] = [];
  avatarUrl?: string;

  constructor(
    public profilesService: ProfilesService,
    public apolloProvider: Apollo
  ) {}

  ngOnInit() {
    this.loadRepositories();
  }

  ngAfterContentInit() {
    console.log(' ng after content init');
    console.log(this.morestuff);
  }

  get experience() {
    return this.profilesService.getProfile(this.profile).experience;
  }

  onNewExperience() {
    this.profilesService.addExperience(this.profile, this.newExperience);
  }

  loadRepositories() {
    this.apolloProvider
      .watchQuery({
        query: gql`
          query {
            user(login: "drasch") {
              avatarUrl
              repositories(first: 20, privacy: PUBLIC) {
                totalCount
                nodes {
                  name
                  url
                }
              }
            }
          }
        `,
      })
      .valueChanges.subscribe(({ data }: any) => {
        console.log(data);
        this.avatarUrl = data?.user?.avatarUrl || null;
        this.repositories = data?.user?.repositories?.nodes || [];
      });
  }
}

interface Repository {
  name: string;
  url: string;
}
