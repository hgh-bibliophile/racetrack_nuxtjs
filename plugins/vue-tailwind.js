import Vue from 'vue'
import VueTailwind from 'vue-tailwind'
import {
  TInput,
  TTextarea,
  TTable
//   TSelect,
//   TRadio,
//   TCheckbox,
//   TButton,
//   TInputGroup,
//   TCard,
//   TAlert,
//   TModal,
//   TDropdown,
//   TRichSelect,
//   TPagination,
//   TTag,
//   TRadioGroup,
//   TCheckboxGroup,
//   TDatepicker,
//   TToggle,
//    TDialog
} from 'vue-tailwind/dist/components'

const settings = {
  // Use the following syntax
  // {component-name}: {
  //   component: {importedComponentObject},
  //   props: {
  //     {propToOverride}: {newDefaultValue}
  //     {propToOverride2}: {newDefaultValue2}
  //   }
  // }
  't-input': {
    component: TInput,
    props: {
      classes: 'border-2 block w-full rounded text-gray-800'
      // ...More settings
    }
  },
  't-table': {
    component: TTable,
    props: {
      classes: {
        table: 'min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border',
        thead: '',
        theadTr: '',
        theadTh: 'px-3 py-2 font-semibold text-left bg-gray-100 border-b',
        tbody: 'bg-white divide-y divide-gray-100',
        tr: '',
        td: 'px-3 py-2 whitespace-no-wrap',
        tfoot: '',
        tfootTr: '',
        tfootTd: ''
      },
      variants: {
        thin: {
          td: 'p-1 whitespace-no-wrap text-sm',
          theadTh: 'p-1 font-semibold text-left bg-gray-100 border-b text-sm'
        }
      }
    }
  },
  't-textarea': {
    component: TTextarea,
    props: {
      classes: 'border-2 block w-full rounded text-gray-800'
      // ...More settings
    }
  }
  // ...Rest of the components
}

Vue.use(VueTailwind, settings)
