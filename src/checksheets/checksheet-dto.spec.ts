import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import 'reflect-metadata';
import {
  ChecksheetsController,
  PatchItemDto,
  PatchSectionDto,
  SectionDto,
} from './checksheets.controller';

/**
 * Partial edits.
 *
 * Reusing the create shape for a PATCH is the quiet version of this bug:
 * turning a seal on failed with "heading must be a string" about a heading
 * nobody was editing. These check that changing one field needs only that
 * field, while creating still demands what it needs.
 */
async function errorsOn<T extends object>(
  cls: new () => T,
  body: Record<string, unknown>,
): Promise<string[]> {
  const dto = plainToInstance(cls, body);
  const errors = await validate(dto as object);
  return errors.map((error) => error.property);
}

describe('partial section edits', () => {
  it('accepts turning a seal on by itself', async () => {
    expect(await errorsOn(PatchSectionDto, { hasSeal: true })).toEqual([]);
  });

  it('accepts renaming by itself', async () => {
    expect(await errorsOn(PatchSectionDto, { heading: 'Airway' })).toEqual([]);
  });

  it('accepts an empty edit rather than inventing a complaint', async () => {
    expect(await errorsOn(PatchSectionDto, {})).toEqual([]);
  });

  it('still refuses a heading of the wrong type', async () => {
    expect(await errorsOn(PatchSectionDto, { heading: 42 })).toEqual([
      'heading',
    ]);
  });

  it('still demands a heading when creating one', async () => {
    // The create shape keeps its requirement; only the patch is relaxed.
    expect(await errorsOn(SectionDto, { hasSeal: true })).toEqual(['heading']);
  });
});

describe('the routes use the partial shapes', () => {
  it('patches a section with the partial DTO, not the create one', () => {
    // The bug was here, not in the DTOs: the PATCH route was annotated with
    // the create shape, so a seal toggle was refused for a missing heading.
    const args = Reflect.getMetadata(
      'design:paramtypes',
      ChecksheetsController.prototype,
      'updateSection',
    ) as Array<{ name: string }>;
    expect(args.map((arg) => arg.name)).toContain('PatchSectionDto');
  });

  it('patches an item with the partial DTO too', () => {
    const args = Reflect.getMetadata(
      'design:paramtypes',
      ChecksheetsController.prototype,
      'updateItem',
    ) as Array<{ name: string }>;
    expect(args.map((arg) => arg.name)).toContain('PatchItemDto');
  });
});

describe('partial item edits', () => {
  it('accepts changing only the expiry tracking', async () => {
    expect(
      await errorsOn(PatchItemDto, { expiryTracking: 'PER_UNIT' }),
    ).toEqual([]);
  });

  it('accepts moving an item out of its section', async () => {
    expect(await errorsOn(PatchItemDto, { sectionId: null })).toEqual([]);
  });

  it('still refuses a kind it does not know', async () => {
    expect(await errorsOn(PatchItemDto, { kind: 'MAYBE' })).toEqual(['kind']);
  });
});
