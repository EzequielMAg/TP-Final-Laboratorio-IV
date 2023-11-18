import { Injectable } from '@angular/core';
import { User } from '../models';
import { UsersApiService } from './json-server/users-api.service';
import { Observable, lastValueFrom } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User | undefined;
  public userLoggedIn: boolean = false;

  public fromCartPageComponent: boolean = false;

  constructor(private usersApiService: UsersApiService) {

    this.loadUserFromLocalStorage();

  }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;

    return structuredClone(this.user)
  }

  public async login(email: string, password: string): Promise<boolean> {

    this.userLoggedIn = false;

    try {
      let apiResponse: Observable<User[]> = this.usersApiService.getUserToAuth(email, password);

      let userResponse: User[] = await lastValueFrom(apiResponse);

      this.user = userResponse[0];

      if (this.user) {

        localStorage.setItem('token', this.user.id.toString());
        this.userLoggedIn = true;
      }
    } catch (error) {
      throw error;
    }

    return this.userLoggedIn;
  }

  public logOut(): void {
    this.user = undefined;
    this.userLoggedIn = false;
    localStorage.clear();

  }

  public checkAuthentication(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  public addUser(user: User){
    return new Promise<User>((resolve, reject) =>{
        this.usersApiService.addUser(user).subscribe({
            next: data => resolve(data),
            error: error => reject(error)
        })
    });
  }

  private loadUserFromLocalStorage(): void {

    // Si no encuentra el id del usuario en el localStorage, entonces no se logueo, no hay nada que recuperar, no se hace nada
    if(!this.checkAuthentication()) return;

    this.userLoggedIn = true;
    this.getLoggedInUser();

  }

  private getLoggedInUser(): void{

    //Obtengo el id del usuario logueado, que quedo guardado en el localStorage
    const idCurrectUser: string = localStorage.getItem('token')!;

    //Con el id cargo el usuario
    this.usersApiService.getUserById(idCurrectUser).subscribe(
      (resp) => {
        this.user = resp;
      }
    );
  }

}
