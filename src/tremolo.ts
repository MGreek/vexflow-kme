// [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Mike Corrigan <corrigan@gmail.com>
//
// This class implements tremolo notation.

import { Modifier } from './modifier';
import { Glyph } from './glyph';
import { GraceNote } from './gracenote';
import { Stem } from './stem';
import { FontInfo } from './types/common';

export interface TremoloRenderOptions {
  stroke_spacing: number;
  stroke_px: number;
  // eslint-disable-next-line
  font_scale: any;
}

export class Tremolo extends Modifier {
  protected readonly code: string;
  protected readonly num: number;
  protected y_spacing?: number;
  protected font?: FontInfo;
  protected render_options?: TremoloRenderOptions;

  static get CATEGORY(): string {
    return 'tremolo';
  }

  constructor(num: number) {
    super();
    this.setAttribute('type', 'Tremolo');

    this.num = num;
    this.position = Modifier.Position.CENTER;
    this.code = 'tremolo1';
  }

  getCategory(): string {
    return Tremolo.CATEGORY;
  }

  draw(): void {
    const ctx = this.checkContext();
    this.checkAttachedNote();
    this.setRendered();

    const note = this.getNote();
    const stemDirection = note.getStemDirection();

    const start = note.getModifierStartXY(this.position, this.index);
    let x = start.x;
    const isGraceNote = note.getCategory() === GraceNote.CATEGORY;
    const scale = isGraceNote ? GraceNote.SCALE : 1;
    const category = `tremolo.${isGraceNote ? 'grace' : 'default'}`;

    this.y_spacing = this.musicFont.lookupMetric(`${category}.spacing`) * stemDirection;
    const height = this.num * this.y_spacing;
    let y = note.getStemExtents().baseY - height;

    if (stemDirection < 0) {
      y += this.musicFont.lookupMetric(`${category}.offsetYStemDown`) * scale;
    } else {
      y += this.musicFont.lookupMetric(`${category}.offsetYStemUp`) * scale;
    }

    this.font = {
      family: 'Arial',
      size: 16 * scale,
      weight: '',
    };

    this.render_options = {
      font_scale: this.musicFont.lookupMetric(`${category}.point`),
      stroke_px: 3,
      stroke_spacing: 10 * scale,
    };

    x += this.musicFont.lookupMetric(`${category}.offsetXStem${stemDirection === Stem.UP ? 'Up' : 'Down'}`);
    for (let i = 0; i < this.num; ++i) {
      Glyph.renderGlyph(ctx, x, y, this.render_options.font_scale, this.code, { category });
      y += this.y_spacing;
    }
  }
}
