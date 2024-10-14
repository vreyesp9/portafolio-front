import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  specialPage: boolean;

  private specialPages: any[] = [
    '/home',

    '/home/nuevo-destinatario',
    '/home/trasferir',
    '/home/historial',

  ];
  constructor() { }

  ngOnInit(): void {
  }

}