// [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
// Author: Taehoon Moon 2016
//
// NoteSubGroup Tests

/* eslint-disable */
// @ts-nocheck

import { VexFlowTests, TestOptions } from './vexflow_test_helpers';
import { QUnit, ok } from './declarations';
import { Barline, BarlineType } from 'stavebarline';
import { BarNote } from 'barnote';
import { StaveNote } from 'stavenote';
import { Note } from 'note';

const NoteSubGroupTests = {
  Start(): void {
    QUnit.module('NoteSubGroup');
    const run = VexFlowTests.runTests;
    run('Basic - ClefNote, TimeSigNote and BarNote', this.draw);
    run('Multi Voice', this.drawMultiVoice);
    run('Multi Voice Multiple Draws', this.drawMultiVoiceMultipleDraw);
    run('Multi Staff', this.drawMultiStaff);
  },

  draw(options: TestOptions): void {
    const f = VexFlowTests.makeFactory(options, 750, 200);
    const ctx = f.getContext();
    const stave = f.Stave({ width: 600 }).addClef('treble');

    const notes = [
      { keys: ['f/5'], stem_direction: -1, duration: '4' },
      { keys: ['d/4'], stem_direction: -1, duration: '4', clef: 'bass' },
      { keys: ['g/4'], stem_direction: -1, duration: '4', clef: 'alto' },
      { keys: ['a/4'], stem_direction: -1, duration: '4', clef: 'alto' },
      { keys: ['c/4'], stem_direction: -1, duration: '4', clef: 'tenor' },
      { keys: ['c/3'], stem_direction: +1, duration: '4', clef: 'tenor' },
      { keys: ['d/4'], stem_direction: -1, duration: '4', clef: 'tenor' },
      { keys: ['f/4'], stem_direction: -1, duration: '4', clef: 'tenor' },
    ].map(f.StaveNote.bind(f));

    function addAccidental(note: any, acc: any): any {
      return note.addModifier(f.Accidental({ type: acc }), 0);
    }

    function addSubGroup(note: any, subNotes: any): any {
      return note.addModifier(f.NoteSubGroup({ notes: subNotes }), 0);
    }

    // {SubNotes} | {Accidental} | {StaveNote}
    addAccidental(notes[1], '#');
    addAccidental(notes[2], 'n');

    addSubGroup(notes[1], [f.ClefNote({ type: 'bass', options: { size: 'small' } })]);
    addSubGroup(notes[2], [f.ClefNote({ type: 'alto', options: { size: 'small' } })]);
    addSubGroup(notes[4], [f.ClefNote({ type: 'tenor', options: { size: 'small' } }), new BarNote()]);
    addSubGroup(notes[5], [f.TimeSigNote({ time: '6/8' })]);
    addSubGroup(notes[6], [new BarNote(Barline.type.REPEAT_BEGIN)]);

    addAccidental(notes[4], 'b');
    addAccidental(notes[6], 'bb');

    const voice = f.Voice().setStrict(false).addTickables(notes);

    f.Formatter().joinVoices([voice]).formatToStave([voice], stave);

    f.draw();

    notes.forEach(function (note) {
      VexFlowTests.plotNoteWidth(ctx, note, 150);
    });

    VexFlowTests.plotLegendForNoteWidth(ctx, 620, 120);

    ok(true, 'all pass');
  },

  drawMultiVoice(options: TestOptions): void {
    const f = VexFlowTests.makeFactory(options, 550, 200);
    const ctx = f.getContext();
    const stave = f.Stave().addClef('treble');

    const notes1 = [
      { keys: ['f/5'], stem_direction: 1, duration: '4' },
      { keys: ['d/4'], stem_direction: 1, duration: '4', clef: 'bass' },
      { keys: ['c/5'], stem_direction: 1, duration: '4', clef: 'alto' },
      { keys: ['c/5'], stem_direction: 1, duration: '4', clef: 'soprano' },
    ].map(f.StaveNote.bind(f));

    const notes2 = [
      { keys: ['c/4'], stem_direction: -1, duration: '4' },
      { keys: ['c/3'], stem_direction: -1, duration: '4', clef: 'bass' },
      { keys: ['d/4'], stem_direction: -1, duration: '4', clef: 'alto' },
      { keys: ['f/4'], stem_direction: -1, duration: '4', clef: 'soprano' },
    ].map(f.StaveNote.bind(f));

    function addAccidental(note: StaveNote, accid: string) {
      return note.addModifier(f.Accidental({ type: accid }), 0);
    }
    function addSubGroup(note: StaveNote, subNotes: Note[]) {
      return note.addModifier(f.NoteSubGroup({ notes: subNotes }), 0);
    }

    addAccidental(notes1[1], '#');

    addSubGroup(notes1[1], [
      f.ClefNote({ type: 'bass', options: { size: 'small' } }),
      new BarNote(Barline.type.REPEAT_BEGIN),
      f.TimeSigNote({ time: '3/4' }),
    ]);
    addSubGroup(notes2[2], [
      f.ClefNote({ type: 'alto', options: { size: 'small' } }),
      f.TimeSigNote({ time: '9/8' }),
      new BarNote(Barline.type.DOUBLE),
    ]);
    addSubGroup(notes1[3], [f.ClefNote({ type: 'soprano', options: { size: 'small' } })]);

    addAccidental(notes1[2], 'b');
    addAccidental(notes2[3], '#');

    const voices = [f.Voice().addTickables(notes1), f.Voice().addTickables(notes2)];

    f.Formatter().joinVoices(voices).formatToStave(voices, stave);

    f.draw();

    notes1.forEach(function (note) {
      VexFlowTests.plotNoteWidth(ctx, note, 150);
    });

    ok(true, 'all pass');
  },

  // draws multiple times. prevents incremental x-shift each draw.
  drawMultiVoiceMultipleDraw(options: TestOptions): void {
    const f = VexFlowTests.makeFactory(options, 550, 200);
    const ctx = f.getContext();
    const stave = f.Stave().addClef('treble');

    const notes1 = [
      { keys: ['f/5'], stem_direction: 1, duration: '4' },
      { keys: ['d/4'], stem_direction: 1, duration: '4', clef: 'bass' },
      { keys: ['c/5'], stem_direction: 1, duration: '4', clef: 'alto' },
      { keys: ['c/5'], stem_direction: 1, duration: '4', clef: 'soprano' },
    ].map(f.StaveNote.bind(f));

    const notes2 = [
      { keys: ['c/4'], stem_direction: -1, duration: '4' },
      { keys: ['c/3'], stem_direction: -1, duration: '4', clef: 'bass' },
      { keys: ['d/4'], stem_direction: -1, duration: '4', clef: 'alto' },
      { keys: ['f/4'], stem_direction: -1, duration: '4', clef: 'soprano' },
    ].map(f.StaveNote.bind(f));

    function addAccidental(note, accid) {
      return note.addModifier(f.Accidental({ type: accid }), 0);
    }
    function addSubGroup(note, subNotes) {
      return note.addModifier(f.NoteSubGroup({ notes: subNotes }), 0);
    }

    addAccidental(notes1[1], '#');

    addSubGroup(notes1[1], [
      f.ClefNote({ type: 'bass', options: { size: 'small' } }),
      new BarNote(BarlineType.REPEAT_BEGIN),
      f.TimeSigNote({ time: '3/4' }),
    ]);
    // Barline.type === BarlineType
    addSubGroup(notes2[2], [
      f.ClefNote({ type: 'alto', options: { size: 'small' } }),
      f.TimeSigNote({ time: '9/8' }),
      new BarNote(Barline.type.DOUBLE),
    ]);
    addSubGroup(notes1[3], [f.ClefNote({ type: 'soprano', options: { size: 'small' } })]);

    addAccidental(notes1[2], 'b');
    addAccidental(notes2[3], '#');

    const voices = [f.Voice().addTickables(notes1), f.Voice().addTickables(notes2)];

    f.Formatter().joinVoices(voices).formatToStave(voices, stave);

    f.draw();
    f.draw();

    notes1.forEach(function (note) {
      VexFlowTests.plotNoteWidth(ctx, note, 150);
    });

    ok(true, 'all pass');
  },

  drawMultiStaff(options: TestOptions): void {
    const f = VexFlowTests.makeFactory(options, 550, 400);

    f.StaveNote = f.StaveNote.bind(f);

    const stave1 = f.Stave({ x: 15, y: 30, width: 500 }).setClef('treble');
    const notes1 = [
      { keys: ['f/5'], stem_direction: 1, duration: '4' },
      { keys: ['d/4'], stem_direction: 1, duration: '4', clef: 'bass' },
      { keys: ['c/5'], stem_direction: 1, duration: '4', clef: 'alto' },
      { keys: ['c/5'], stem_direction: 1, duration: '4', clef: 'soprano' },
    ].map(f.StaveNote);

    const notes2 = [
      { keys: ['c/4'], stem_direction: -1, duration: '4' },
      { keys: ['c/3'], stem_direction: -1, duration: '4', clef: 'bass' },
      { keys: ['d/4'], stem_direction: -1, duration: '4', clef: 'alto' },
      { keys: ['f/4'], stem_direction: -1, duration: '4', clef: 'soprano' },
    ].map(f.StaveNote);

    const stave2 = f.Stave({ x: 15, y: 150, width: 500 }).setClef('bass');

    const notes3 = [
      { keys: ['e/3'], duration: '8', stem_direction: -1, clef: 'bass' },
      { keys: ['g/4'], duration: '8', stem_direction: 1, clef: 'treble' },
      { keys: ['d/4'], duration: '8', stem_direction: 1, clef: 'treble' },
      { keys: ['f/4'], duration: '8', stem_direction: 1, clef: 'treble' },
      { keys: ['c/4'], duration: '8', stem_direction: 1, clef: 'treble' },
      { keys: ['g/3'], duration: '8', stem_direction: -1, clef: 'bass' },
      { keys: ['d/3'], duration: '8', stem_direction: -1, clef: 'bass' },
      { keys: ['f/3'], duration: '8', stem_direction: -1, clef: 'bass' },
    ].map(f.StaveNote);

    f.StaveConnector({ top_stave: stave1, bottom_stave: stave2, type: 'brace' });
    f.StaveConnector({ top_stave: stave1, bottom_stave: stave2, type: 'singleLeft' });
    f.StaveConnector({ top_stave: stave1, bottom_stave: stave2, type: 'singleRight' });

    function addAccidental(note, acc) {
      return note.addModifier(f.Accidental({ type: acc }), 0);
    }
    function addSubGroup(note, subNotes) {
      return note.addModifier(f.NoteSubGroup({ notes: subNotes }), 0);
    }

    f.Beam({ notes: notes3.slice(1, 4) });
    f.Beam({ notes: notes3.slice(5) });

    addAccidental(notes1[1], '#');
    addSubGroup(notes1[1], [f.ClefNote({ type: 'bass', options: { size: 'small' } }), f.TimeSigNote({ time: '3/4' })]);
    addSubGroup(notes2[2], [f.ClefNote({ type: 'alto', options: { size: 'small' } }), f.TimeSigNote({ time: '9/8' })]);
    addSubGroup(notes1[3], [f.ClefNote({ type: 'soprano', options: { size: 'small' } })]);
    addSubGroup(notes3[1], [f.ClefNote({ type: 'treble', options: { size: 'small' } })]);
    addSubGroup(notes3[5], [f.ClefNote({ type: 'bass', options: { size: 'small' } })]);
    addAccidental(notes3[0], '#');
    addAccidental(notes3[3], 'b');
    addAccidental(notes3[5], '#');
    addAccidental(notes1[2], 'b');
    addAccidental(notes2[3], '#');

    const voice1 = f.Voice().addTickables(notes1);
    const voice2 = f.Voice().addTickables(notes2);
    const voice3 = f.Voice().addTickables(notes3);

    f.Formatter().joinVoices([voice1, voice2]).joinVoices([voice3]).formatToStave([voice1, voice2, voice3], stave1);

    f.draw();

    ok(true, 'all pass');
  },
};

export { NoteSubGroupTests };