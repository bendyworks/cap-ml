import { Component, OnInit } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { CapML } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {}

  ngOnInit() {
    CapML.echo({value: 'hello'}).then((res) => console.log("got: " + res['value']));
  }
}
