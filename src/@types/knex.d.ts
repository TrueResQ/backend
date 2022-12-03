import { Knex } from "knex";

import {
  CONTACT,
  Contact,
  ContactInsertType,
  ContactUpdateType,
  CUSTOM_NFTS,
  CUSTOM_TOKENS,
  CustomNfts,
  CustomNftsInsertType,
  CustomNftsUpdateType,
  CustomTokens,
  CustomTokensInsertType,
  CustomTokensUpdateType,
  PERMISSION,
  Permission,
  PermissionInsertType,
  PermissionUpdateType,
  TransactionInsertType,
  TRANSACTIONS,
  Transactions,
  TransactionUpdateType,
  USER,
  User,
  UserInsertType,
  UserUpdateType,
} from "../models/interfaces";

// Update these types whenever migrations change
declare module "knex/types/tables" {
  interface Tables {
    [USER]: Knex.CompositeTableType<User, UserInsertType, UserUpdateType>;
    [TRANSACTIONS]: Knex.CompositeTableType<Transactions, TransactionInsertType, TransactionUpdateType>;
    [CONTACT]: Knex.CompositeTableType<Contact, ContactInsertType, ContactUpdateType>;
    [PERMISSION]: Knex.CompositeTableType<Permission, PermissionInsertType, PermissionUpdateType>;
    [CUSTOM_NFTS]: Knex.CompositeTableType<CustomNfts, CustomNftsInsertType, CustomNftsUpdateType>;
    [CUSTOM_TOKENS]: Knex.CompositeTableType<CustomTokens, CustomTokensInsertType, CustomTokensUpdateType>;
  }
}
