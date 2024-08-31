import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterListComponent } from './components/character/list/character-list.component';
import { LocationListComponent } from './components/location/list/location-list.component';
import { EpisodeListComponent } from './components/episodes/list/episode-list.component';
import { LocationDetailComponent } from './components/location/detail/location-detail.component';
import { EpisodeDetailComponent } from './components/episodes/detail/episode-detail.component';
import { DimensionListComponent } from './components/dimension/list/dimension-list.component';
import { DimensionDetailComponent } from './components/dimension/detail/dimension-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterListComponent },
  { path: 'locations', component: LocationListComponent },
  { path: 'locations/:id', component: LocationDetailComponent },
  { path: 'episodes', component: EpisodeListComponent },
  { path: 'episodes/:id', component: EpisodeDetailComponent },
  { path: 'dimensions', component: DimensionListComponent },
  { path: 'dimensions/:name', component: DimensionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
