import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatar',
  standalone: false
})
export class AvatarPipe implements PipeTransform {

  transform(value: string): string {
      if (!value) return '';

    const parts = value.trim().split(/\s+/);

     if (parts.length === 1) {
    
      return parts[0].substring(0, 2).toUpperCase();
    } else {
      
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
  }

}
