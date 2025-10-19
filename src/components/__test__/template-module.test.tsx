import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SM } from '../../main'
import { TemplateModule, TemplateModuleType } from '../template-module'

describe('TemplateModule', () => {
    it('renders CheckboxModule correctly', () => {
        render(
            <SM>
                <TemplateModule
                    type={TemplateModuleType.CHECKBOX}
                    key="test-checkbox"
                    required={true}
                    label="Test Checkbox"
                    description="This is a test checkbox"
                />
            </SM>
        )
        const headingElement = screen.getByText('Test Checkbox')
        expect(headingElement).toBeCalled()
    })
})
