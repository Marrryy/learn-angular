import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service'; 
import { MessagesService } from "../messages.service";


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes : Hero[];
  selectedHero : Hero;

  onSelect(hero : Hero):void{
    this.selectedHero= hero;
    this.messagesService.add(`Heroes Component: Selected hero id=${hero.id}`);
  }

  getHeroes():void{
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  constructor(private heroService:HeroService, private messagesService:MessagesService) { 
  }

  ngOnInit() {
    this.getHeroes()
  }

}
