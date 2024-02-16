import { Component } from '@angular/core';
import { routes } from '../../consts/routes';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public routes: typeof routes = routes;
  public isOpenLocations = false;
  public isOpenEquipaments = false;
  public isOpenContracts = false;
  isAdmin = false;

  constructor(private userService: UserService){
    this.isAdmin = userService.isAdmin();
  }

  public openLocations() {
    this.isOpenLocations = !this.isOpenLocations;
  }

  public openEquipaments(){
    this.isOpenEquipaments = !this.isOpenEquipaments;
  }

  public openContracts(){
    this.isOpenContracts = !this.isOpenContracts;
  }
}
