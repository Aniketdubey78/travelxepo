import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const platformId = inject(PLATFORM_ID);
  let token = '';

    if (req.url.includes('cloudinary.com')) {
    return next(req);
  }

  if (isPlatformBrowser(platformId)) {
    const user = sessionStorage.getItem('Loggedinuser');
    if (user) {
      const userData = JSON.parse(user);
    
      token = userData.data?.token || userData.token;
    }
  }

  
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
 
  return next(req);
};
