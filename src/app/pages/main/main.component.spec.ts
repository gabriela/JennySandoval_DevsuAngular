import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MainComponent,
        TranslateModule.forRoot(),
        RouterModule.forRoot([])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidenav state', () => {
    component.showSidenav = true;
    document.body.innerHTML = `<div class="sidenav"></div>`;
    component.toggleSidenav();
    expect(component.showSidenav).toBe(false);
    const sidenav = document.querySelector('.sidenav');
    expect(sidenav?.classList.contains('closed')).toBe(true);
  });

  it('should switch language', () => {
    const spy = jest.spyOn(component['translate'], 'use');
    component.switchLang('es');
    expect(spy).toHaveBeenCalledWith('es');
  });
});
