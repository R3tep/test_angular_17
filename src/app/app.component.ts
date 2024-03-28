import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SvgIconService } from './services/icons.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [SvgIconService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    protected _svgIcon: SvgIconService,
  ) {}
}
