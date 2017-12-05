import { Component } from '@angular/core';

@Component({
  selector: 'prof-pic',
  template: `
  <br>
  <div fxLayout="row" fxLayoutAlign="space-around center">
  <div fxLayout="row" fxLayoutAlign="center center">
  <i class="material-icons">link</i>
  <md-input-container>
  <input mdInput placeholder="Picture Link" />
  </md-input-container>
  </div>
  <button md-raised-button type="submit" color="primary" md-dialog-close>SAVE</button>
  </div>
  `
})

export class ProfilePicComponent {
  
}
