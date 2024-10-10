import ReportComponent from './components/ReportComponent';

/*
- Define layout for the viewer in mode configuration.
- Pass in the viewport types that can populate the viewer.
- Init layout based on the displaySets and the objects.
*/

export default function () {

  return [
    // Layout Template Definition
    // TODO: this is weird naming
    {
      name: 'reportLayout',
      id: 'reportLayout',
      component: ReportComponent,
    },
  ];
}
