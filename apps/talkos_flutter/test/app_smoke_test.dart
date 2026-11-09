import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/app/talkos_app.dart';

void main() {
  testWidgets('TalkOS launches into the native operations shell', (tester) async {
    await tester.pumpWidget(const TalkOsApp());
    expect(find.text('TalkOS'), findsOneWidget);
    expect(find.text('Operations modules'), findsOneWidget);
    expect(find.text('Point of Sale'), findsWidgets);
  });
}
