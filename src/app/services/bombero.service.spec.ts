import { TestBed } from '@angular/core/testing';

import { BomberoService } from './bombero.service';

describe('BomberoService', () => {
  let service: BomberoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BomberoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
