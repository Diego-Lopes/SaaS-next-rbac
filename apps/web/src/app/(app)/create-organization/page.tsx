import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreateOrganization() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create organization</h1>

      <form action="">
        <div className="space-y-1">
          <Label htmlFor="organization">Organization name</Label>
          <Input name="organization" id="organization" />
        </div>
        <div className="space-y-4">
          <Label htmlFor="domain">E-mail domain</Label>
          <Input
            name="domain"
            type="text"
            id="email"
            inputMode="url"
            placeholder="example.com"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <Checkbox
              name="shouldAttachUserByDomain"
              id="shouldAttachUserByDomain"
              className="translate-y-0.5"
            />
            <label htmlFor="shouldAttachUserByDomain" className="spacy-y-1">
              <span className="text-sm leading-none font-medium">
                Auto-join new members
              </span>
              <p className="text-muted-foreground text-sm">
                This will automatically invite all members with same e-mail to
                this organization.
              </p>
            </label>
          </div>
        </div>
        <Button className="w-full" type="submit">
          Save organization
        </Button>
      </form>
    </div>
  )
}
