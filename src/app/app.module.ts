import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CharacterListComponent } from './components/character/list/character-list.component';
import { LocationListComponent } from './components/location/list/location-list.component';
import { EpisodeListComponent } from './components/episodes/list/episode-list.component';
import { CharacterListItemComponent } from './components/character/list/list-item/character-list-item.component';
import { LocationListItemComponent } from './components/location/list/list-item/location-list-item.component';
import { EpisodeListItemComponent } from './components/episodes/list/list-item/episode-list-item.component';
import { HeaderComponent } from './components/header/header.component';
import { LocationDetailComponent } from './components/location/detail/location-detail.component';
import { EpisodeDetailComponent } from './components/episodes/detail/episode-detail.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { DimensionListComponent } from './components/dimension/list/dimension-list.component';
import { DimensionListItemComponent } from './components/dimension/list/list-item/dimension-list-item.component';
import { DimensionDetailComponent } from './components/dimension/detail/dimension-detail.component';
import { CharacterDetailComponent } from './components/character/detail/character-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CharacterListComponent,
    CharacterListItemComponent,
    CharacterDetailComponent,
    LocationListComponent,
    LocationListItemComponent,
    LocationDetailComponent,
    EpisodeListComponent,
    EpisodeListItemComponent,
    EpisodeDetailComponent,
    PaginationComponent,
    DimensionListComponent,
    DimensionListItemComponent,
    DimensionDetailComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
