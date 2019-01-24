import { TestBed } from '@angular/core/testing';

import { StorageEnvService } from './storage-env.service';

describe('StorageEnvService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageEnvService = TestBed.get(StorageEnvService);
    expect(service).toBeTruthy();
  });
});
