import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-generate-helper',
  templateUrl: './generate-helper.component.html',
  styleUrls: ['./generate-helper.component.css'],
})
export class GenerateHelperComponent {
  @Input() component: string = '';
  @Input() name: string = '';
}
