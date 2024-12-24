import Image from "next/image";
import IntlProvider from "@/providers/intl-provider";
import { FormattedMessage } from "@/components/intl/formatters";
import LocaleSelect from "@/components/intl/inputs/locale-select";
const INTL_MODULE_NAME = "auth";
export default function AuthLayout({ children }) {
  return (
    <IntlProvider moduleName={INTL_MODULE_NAME}>
      <main className="grid h-full grid-cols-2">
        <div className="container hidden flex-col items-center justify-center gap-5 bg-primary md:flex">
          <Image
            src="/global/images/full-logo.webp"
            alt="BLS's logo"
            width={300}
            height={100}
          />
          <p className="text-center text-xl text-primary-foreground w-2/3">
            <FormattedMessage id="auth.welcome" />
          </p>
        </div>
        <div className="relative col-span-2 h-full md:col-span-1">
          <div className="fixed inset-x-0 top-0 flex items-center justify-between p-5 md:justify-end">
            <Image
              src="/global/images/full-logo-color.webp"
              alt="BLS's logo"
              width={100}
              height={100}
              className="md:hidden"
            />
            <div className="flex items-center">
              <LocaleSelect />
              <Image
                src="/global/images/afrikskills-logo.webp"
                alt="AfrikSkills's logo"
                width={100}
                height={100}
              />
            </div>
          </div>
          {children}
        </div>
        <div className="fixed inset-x-0 bottom-0 text-center text-xs italic text-muted-foreground md:left-1/2">
          &copy; {new Date().getFullYear()}{" "}
          <FormattedMessage id="auth.copyright" />
        </div>
      </main>
    </IntlProvider>
  );
}
