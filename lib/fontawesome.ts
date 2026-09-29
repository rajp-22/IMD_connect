import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuildingColumns, faShield } from '@fortawesome/free-solid-svg-icons';

export const byPrefixAndName = {
  fas: {
    'user': faUser,
    'building-columns': faBuildingColumns,
    'shield': faShield,
  },
  fass: {
    'building-columns': faBuildingColumns,
  },
} as const;

export { FontAwesomeIcon };
