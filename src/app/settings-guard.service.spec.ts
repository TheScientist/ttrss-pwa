import { TestBed, inject } from '@angular/core/testing';

import { SettingsGuardService } from './settings-guard.service';

describe('SettingsGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsGuardService]
    });
  });

  it('should be created', inject([SettingsGuardService], (service: SettingsGuardService) => {
    expect(service).toBeTruthy();
  }));
});
