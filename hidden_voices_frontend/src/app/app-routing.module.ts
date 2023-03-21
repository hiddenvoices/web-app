import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateComponent } from './features/generate/generate.component';
import { ScrapeComponent } from './features/scrape/scrape.component';

const routes: Routes = [
  { path: 'scrape', component: ScrapeComponent },
  { path: 'generate', component: GenerateComponent },
  { path: '**', redirectTo: '/scrape', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
