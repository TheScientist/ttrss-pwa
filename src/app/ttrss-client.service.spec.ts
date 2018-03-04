import { TestBed, inject } from '@angular/core/testing';

import { TtrssClientService } from './ttrss-client.service';

describe('TtrssClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TtrssClientService]
    });
  });

  it('should be created', inject([TtrssClientService], (service: TtrssClientService) => {
    expect(service).toBeTruthy();
  }));
});
