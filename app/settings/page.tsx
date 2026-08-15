import { SettingsClient } from '../../components/settings-client';

export default function Settings() {
  return (
    <div className="page">
      <div className="eyebrow">Your workspace</div>
      <h1 className="h1">Settings</h1>
      <p className="subtle" style={{ maxWidth: 550, marginBottom: 28 }}>
        Control your local study data and keep a portable backup of your preparation.
      </p>
      <SettingsClient />
    </div>
  );
}
