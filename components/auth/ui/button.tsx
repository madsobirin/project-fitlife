import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type TypeButton = {
  titleButton: string;
  disabled?: boolean;
};

function SubmitButton({ titleButton, disabled }: TypeButton) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-[26px] font-semibold text-white hover:bg-emerald-600 active:scale-[0.97] transition shadow-sm"
    >
      {pending ? (
        <Loader2 className="animate-spin h-5 w-5" />
      ) : (
        <>{titleButton} →</>
      )}
    </Button>
  );
}
export default SubmitButton;
