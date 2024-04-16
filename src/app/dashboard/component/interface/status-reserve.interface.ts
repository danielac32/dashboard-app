export enum StatusReserve {
    PENDING = 'PENDING',
    REFUSED = 'REFUSED',
    ACCEPTED = 'ACCEPTED'
  };

export type StatusReserveTypes = StatusReserve.ACCEPTED | StatusReserve.PENDING | StatusReserve.REFUSED;