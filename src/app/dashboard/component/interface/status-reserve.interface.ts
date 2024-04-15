export enum StatusReserve {
    PENDING = 'pending',
    REFUSED = 'refused',
    ACCEPTED = 'accepted'
  };

export type StatusReserveTypes = StatusReserve.ACCEPTED | StatusReserve.PENDING | StatusReserve.REFUSED;