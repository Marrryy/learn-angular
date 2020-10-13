import { Injectable } from '@angular/core';
import { Hero } from "./hero";
import { HEROES } from "./mock-heroes";
import { Observable, of } from 'rxjs';
import { MessagesService } from "./messages.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  getHeroes(): Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    )
  }
  getHero(id:number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched heroes id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  addHero(hero: Hero):Observable<Hero>{
    return this.http.post(this.heroesUrl,hero,this.httpOptions).pipe(
      tap((newHero : Hero)=> this.log(`added Hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number):Observable<Hero>{
    const id = typeof hero === 'number'? hero :hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ =>this.log(`delete heroes id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term:string):Observable<Hero[]>{
    if(!term.trim()){
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ? 
        this.log(`Search heroes w/ term: ${term}`) :
        this.log(`no heroes w/ term: ${term}`)),
      catchError(this.handleError<Hero[]>('SearchHeroes', []))
    )
  }

  httpOptions= {
    headers:new HttpHeaders({'Content-Type': 'application/json'})
  }

  
  constructor(
    private http: HttpClient,
    private messageService:MessagesService) { }
    private log(message:string){
      this.messageService.add(`HeroService: ${message}`);
    }
    private heroesUrl='api/heroes';

    private handleError<T>(operation = 'operation', result?:T){
      return (error:any): Observable<T>=>{
        console.error(error);
        this.log(`${operation} failed: $(error.message)`);
        return of(result as T)
      }
    }
}

