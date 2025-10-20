import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TemplateModule, TemplateModuleType } from '../template-module'

describe('TemplateModule', () => {
    it('renders CheckboxModule correctly', () => {
        render(
            <TemplateModule
                type={TemplateModuleType.CHECKBOX}
                key="test-checkbox"
                required={true}
                label="Test Checkbox"
                description="This is a test checkbox"
            />
        )
        const headingElement = screen.getByText('Test Checkbox')
        expect(headingElement).toBeCalled()
    })
})
