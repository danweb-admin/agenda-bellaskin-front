import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public danweb: string = 'https://www.instagram.com/danweb.softwares/';
  public danweb_whatsapp: string = 'https://wa.me/5543996246119';
  public danweb_linktree: string = 'https://linktr.ee/danweb.softwares'
}
