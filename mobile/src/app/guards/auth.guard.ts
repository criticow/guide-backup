import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const globalService = inject(GlobalService);
  const motoristaId = localStorage.getItem("motoristaId");

  if(motoristaId) {
    globalService.setIsAuthenticated(true);
    return true;
  }

  globalService.setIsAuthenticated(false);
  router.navigate(["/auth"]);
  return false;
};
