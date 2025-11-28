import React, { useState } from "react";
import GenderSelectionScreen from "./GenderSelectionScreen";
import TraitSelectionScreen from "./TraitSelectionScreen";

export default function AvatarCustomization({ onComplete }) {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState(null);

  const handleNext = () => {
    if (gender) {
      setStep(2);
    }
  };

  const handleCompleteAvatar = (avatarData) => {
    const fullAvatarData = {
      name: "Gestora Enfermera",
      ...avatarData,
      face: null,
      eyeColor: null,
      eyeShape: null,
      noseType: null,
      mouth: null,
      hairType: null,
      hairColor: null,
      uniform: null,
      accessory: null,
    };

    localStorage.setItem("playerAvatar", JSON.stringify(fullAvatarData));
    onComplete();
  };

  return (
    <>
      {step === 1 && (
        <GenderSelectionScreen
          gender={gender}
          setGender={setGender}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <TraitSelectionScreen
          gender={gender}
          onComplete={handleCompleteAvatar}
          onBack={() => setStep(1)}
        />
      )}
    </>
  );
}
