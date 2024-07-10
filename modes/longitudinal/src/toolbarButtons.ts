// TODO: torn, can either bake this here; or have to create a whole new button type
// Only ways that you can pass in a custom React component for render :l
import { ToolbarService, ViewportGridService } from '@ohif/core';
import type { Button, RunCommand } from '@ohif/core/types';
import { EVENTS } from '@cornerstonejs/core';

const { createButton } = ToolbarService;

const ReferenceLinesListeners: RunCommand = [
  {
    commandName: 'setSourceViewportForReferenceLinesTool',
    context: 'CORNERSTONE',
  },
];

export const setToolActiveToolbar = {
  commandName: 'setToolActiveToolbar',
  commandOptions: {
    toolGroupIds: ['default', 'mpr', 'SRToolGroup', 'volume3d'],
  },
};

const toolbarButtons: Button[] = [
  {
    id: 'Zoom',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-zoom',
      label: 'Zoom',
      commands: setToolActiveToolbar,
      evaluate: 'evaluate.cornerstoneTool',
    },
  },
  // Window Level
  {
    id: 'WindowLevel',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-window-level',
      label: 'Window Level',
      commands: setToolActiveToolbar,
      evaluate: 'evaluate.cornerstoneTool',
    },
  },
  // Pan...
  {
    id: 'Pan',
    uiType: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-move',
      label: 'Pan',
      commands: setToolActiveToolbar,
      evaluate: 'evaluate.cornerstoneTool',
    },
  },
  {
    id: 'StackScroll',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-stack-scroll',
      label: 'Stack Scroll',
      commands: setToolActiveToolbar,
      evaluate: 'evaluate.cornerstoneTool',
    },
  },
  {
    id: 'Divider',
    uiType: 'ohif.divider',
  },
  // {
  //   id: 'Probe',
  //   uiType: 'ohif.radioGroup',
  //   props: {
  //     icon: 'tool-probe',
  //     label: 'Probe',
  //     tooltip: 'Probe',
  //     commands: setToolActiveToolbar,
  //     evaluate: 'evaluate.cornerstoneTool',
  //   }
  // },
  {
    id: 'Length',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-length',
      label: 'Length',
      commands: setToolActiveToolbar,
      evaluate: 'evaluate.cornerstoneTool',
    },
  },

  {
    id: 'EllipticalROI',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-ellipse',
      label: 'Ellipse',
      commands: setToolActiveToolbar,
      evaluate: 'evaluate.cornerstoneTool',
    }
  },
  {
    id: 'RectangleROI',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-rectangle',
      label: 'Rectangle',
      commands: setToolActiveToolbar,
      evaluate: 'evaluate.cornerstoneTool',
    }
  },
  {
    id: 'MeasurementTools',
    uiType: 'ohif.splitButton',
    props: {
      groupId: 'MeasurementTools',
      // group evaluate to determine which item should move to the top
      evaluate: 'evaluate.group.promoteToPrimaryIfCornerstoneToolNotActiveInTheList',
      primary: createButton({
        id: 'Angle',
        icon: 'tool-angle',
        label: 'Angle',
        tooltip: 'Angle',
        commands: setToolActiveToolbar,
        evaluate: 'evaluate.cornerstoneTool',
      }),
      secondary: {
        icon: 'chevron-down',
        tooltip: 'More Measure Tools',
      },
      items: [
        // createButton({
        //   id: 'Length',
        //   icon: 'tool-length',
        //   label: 'Length',
        //   tooltip: 'Length Tool',
        //   commands: setToolActiveToolbar,
        //   evaluate: 'evaluate.cornerstoneTool',
        // }),
        createButton({
          id: 'Angle',
          icon: 'tool-angle',
          label: 'Angle',
          tooltip: 'Angle',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
        createButton({
          id: 'CobbAngle',
          icon: 'icon-tool-cobb-angle',
          label: 'Cobb Angle',
          tooltip: 'Cobb Angle',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
        createButton({
          id: 'Bidirectional',
          icon: 'tool-bidirectional',
          label: 'Bidirectional',
          tooltip: 'Bidirectional Tool',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
        createButton({
          id: 'ArrowAnnotate',
          icon: 'tool-annotate',
          label: 'Annotation',
          tooltip: 'Arrow Annotate',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
        createButton({
          id: 'Probe',
          icon: 'tool-probe',
          label: 'Probe',
          tooltip: 'Probe',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
        // createButton({
        //   id: 'EllipticalROI',
        //   icon: 'tool-ellipse',
        //   label: 'Ellipse',
        //   tooltip: 'Ellipse ROI',
        //   commands: setToolActiveToolbar,
        //   evaluate: 'evaluate.cornerstoneTool',
        // }),
        // createButton({
        //   id: 'RectangleROI',
        //   icon: 'tool-rectangle',
        //   label: 'Rectangle',
        //   tooltip: 'Rectangle ROI',
        //   commands: setToolActiveToolbar,
        //   evaluate: 'evaluate.cornerstoneTool',
        // }),
        createButton({
          id: 'CircleROI',
          icon: 'tool-circle',
          label: 'Circle',
          tooltip: 'Circle Tool',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
        createButton({
          id: 'PlanarFreehandROI',
          icon: 'icon-tool-freehand-roi',
          label: 'Freehand ROI',
          tooltip: 'Freehand ROI',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
        createButton({
          id: 'SplineROI',
          icon: 'icon-tool-spline-roi',
          label: 'Spline ROI',
          tooltip: 'Spline ROI',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
        createButton({
          id: 'LivewireContour',
          icon: 'icon-tool-livewire',
          label: 'Livewire tool',
          tooltip: 'Livewire tool',
          commands: setToolActiveToolbar,
          evaluate: 'evaluate.cornerstoneTool',
        }),
      ],
    },
  },
  {
    id: 'Reset',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-reset',
      label: 'Reset View',
      commands: 'resetViewport',
      evaluate: 'evaluate.action',
    }
  },
  {
    id: 'invert',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-invert',
      label: 'Invert',
      commands: 'invertViewport',
      evaluate: 'evaluate.viewportProperties.toggle',
    }
  },
  {
    id: 'rotate-right',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-rotate-right',
      label: 'Rotate Right',
      commands: 'rotateViewportCW',
      evaluate: 'evaluate.action',
    }
  },
  {
    id: 'flipHorizontal',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-flip-horizontal',
      label: 'Flip Horizontal',
      commands: 'flipViewportHorizontal',
      evaluate: ['evaluate.viewportProperties.toggle', 'evaluate.not3D'],
    }
  },
  {
    id: 'TrackballRotate',
    uiType: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-3d-rotate',
      label: '3D Rotate',
      commands: setToolActiveToolbar,
      evaluate: {
        name: 'evaluate.cornerstoneTool',
        disabledText: 'Select a 3D viewport to enable this tool',
      },
    },
  },
  // {
  //   id: 'Capture',
  //   uiType: 'ohif.radioGroup',
  //   props: {
  //     icon: 'tool-capture',
  //     label: 'Capture',
  //     commands: 'showDownloadViewportModal',
  //     evaluate: 'evaluate.action',
  //   },
  // },
  {
    id: 'Layout',
    uiType: 'ohif.layoutSelector',
    props: {
      rows: 3,
      columns: 4,
      evaluate: 'evaluate.action',
    },
  },
  {
    id: 'Crosshairs',
    uiType: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-crosshair',
      label: 'Crosshairs',
      commands: {
        commandName: 'setToolActiveToolbar',
        commandOptions: {
          toolGroupIds: ['mpr'],
        },
      },
      evaluate: {
        name: 'evaluate.cornerstoneTool',
        disabledText: 'Select an MPR viewport to enable this tool',
      },
    },
  },
  {
    id: 'ReferenceLines',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-referenceLines',
      label: 'Reference Lines',
      tooltip: 'Show Reference Lines',
      commands: 'toggleEnabledDisabledToolbar',

      listeners: {
        [ViewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED]: ReferenceLinesListeners,
        [ViewportGridService.EVENTS.VIEWPORTS_READY]: ReferenceLinesListeners,
      },
      evaluate: 'evaluate.cornerstoneTool.toggle',
    },
  },
];

export default toolbarButtons;
