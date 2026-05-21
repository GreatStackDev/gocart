# ENHANCMENTS

## Pull Request Summary

Modernized the app foundation and completed the migration work across TypeScript, Redux, Prisma, and project structure.

## Changes Made

- Migrated the app into the `/src` directory structure.
- Updated the project to Next.js 16.
- Migrated JavaScript files to TypeScript/TSX.
- Updated `tsconfig.json` for current TypeScript behavior by removing deprecated `baseUrl`.
- Added strongly typed Redux store exports:
  - `AppStore`
  - `RootState`
  - `AppDispatch`
- Added typed Redux hooks:
  - `useAppSelector`
  - `useAppDispatch`
- Strongly typed Redux slices:
  - cart
  - product
  - address
  - rating
- Typed Redux reducer payloads using `PayloadAction`.
- Updated Redux consumers to use typed hooks instead of untyped `useSelector` / `useDispatch`.
- Fixed Redux-dependent TypeScript issues in cart, product, order summary, navbar, and product components.
- Upgraded Prisma schema for Prisma 7 compatibility.
- Removed deprecated Prisma `driverAdapters` preview feature.
- Removed deprecated `url` and `directUrl` datasource fields from `schema.prisma`.
- Added `prisma.config.ts` for datasource configuration.
- Updated Prisma generator to use `prisma-client` with explicit output path.
- Added generated Prisma client output to `.gitignore`.
- Resolved TypeScript issues around:
  - file upload state typing
  - dashboard revenue number typing
  - invalid JSX props
  - coupon object typing
  - textarea `rows` value typing
- Addressed package vulnerabilities through dependency updates.
- Prepared project for Prisma PostgreSQL adapter setup.

## Verification

- Ran TypeScript validation:

```bash
npx tsc --noEmit --pretty false
```

- TypeScript now passes successfully.
- Redux selector type errors are resolved.
- Prisma schema no longer uses deprecated datasource URL fields or deprecated preview feature config.
